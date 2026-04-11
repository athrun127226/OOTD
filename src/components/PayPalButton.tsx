import { useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useAuthStore } from '@/store'
import { toast } from 'sonner'

interface PayPalButtonProps {
  plan: 'monthly' | 'yearly'
  onSuccess?: () => void
}

// 内部组件，使用 PayPal 状态
function PayPalButtonInner({ plan, onSuccess }: PayPalButtonProps) {
  const { user, updateProfile } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [{ isPending }] = usePayPalScriptReducer()

  // PayPal 不支持 CNY，使用 USD（约等于价格）
  const pricing = {
    monthly: { amount: '1.50', description: 'OOTD Pro - Monthly' },
    yearly: { amount: '12.00', description: 'OOTD Pro - Yearly' },
  }

  const { amount, description } = pricing[plan]

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        <span className="ml-2 text-sm text-muted-foreground">加载支付组件...</span>
      </div>
    )
  }

  return (
    <PayPalButtons
      style={{
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 48,
      }}
      createOrder={(_data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              description,
              amount: {
                currency_code: 'USD',
                value: amount,
              },
            },
          ],
        })
      }}
      onApprove={async (_data, actions) => {
        if (!actions.order) return
        
        setIsProcessing(true)
        try {
          const orderDetails = await actions.order.capture()
          console.log('Payment successful:', orderDetails)

          // 更新用户会员状态
          updateProfile({
            isPro: true,
            proPlan: plan,
            proStartDate: new Date().toISOString(),
            proEndDate: plan === 'monthly'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          })

          toast.success('🎉 恭喜！你已成为 Pro 会员')
          onSuccess?.()
        } catch (error) {
          console.error('Payment capture error:', error)
          toast.error('支付处理失败，请稍后重试')
        } finally {
          setIsProcessing(false)
        }
      }}
      onError={(err) => {
        console.error('PayPal error:', err)
        toast.error('支付出错，请稍后重试')
      }}
      onCancel={() => {
        toast.info('支付已取消')
      }}
      disabled={isProcessing || user?.isPro}
    />
  )
}

export default function PayPalButton(props: PayPalButtonProps) {
  return <PayPalButtonInner {...props} />
}