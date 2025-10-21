import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface SuccessToastProps {
  title: string
  description: string
  type?: "success" | "error" | "info"
}

export function SuccessToast({ title, description, type = "success" }: SuccessToastProps) {
  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  }

  const iconColor = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  }

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${iconColor.success}`} />,
    error: <AlertCircle className={`w-5 h-5 ${iconColor.error}`} />,
    info: <Info className={`w-5 h-5 ${iconColor.info}`} />,
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor[type]}`}>
      {icons[type]}
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}
