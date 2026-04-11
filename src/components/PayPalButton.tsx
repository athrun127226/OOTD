import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useAuthStore } from '@/store'
import { toast } from 'sonner'

interface PayPalButtonProps {
  plan: 'monthly' | 'yearly'
  onSuccess?: () => void
}

export default function PayPalButton({ plan, onSuccess }: PayPalButtonProps) {
  const { user, updateProfile } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const pricing = {
    monthly: { amount: '9.90', description: 'OOTD Pro 会员 - 月度订阅' },
    yearly: { amount: '88.00', description: 'OOTD Pro 会员 - 年度订阅' },
  }

  const { amount, description } = pricing[plan]

  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'CNY',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: 48,
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description,
                amount: {
                  currency_code: 'CNY',
                  value: amount,
                },
              },
            ],
          })
        }}
        onApprove={async (data, actions) => {
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
    </PayPalScriptProvider>
  )
}