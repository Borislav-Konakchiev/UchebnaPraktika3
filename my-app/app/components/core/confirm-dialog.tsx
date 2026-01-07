import type { VariantProps } from 'class-variance-authority' 
import { useState } from 'react' 
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from '~/components/ui/alert-dialog' 
import { buttonVariants } from '~/components/ui/button' 
import { Spinner } from '../ui/spinner' 
 
export type ConfirmDialogProps = { 
  title: string 
  description: string 
  onConfirm: () => void | Promise<void> 
  children: (props: { 
    onClick: () => void 
    disabled: boolean 
  }) => React.ReactNode 
  cancelLabel?: string 
  confirmLabel?: string 
  variant?: VariantProps<typeof buttonVariants>['variant'] 
  disabled?: boolean 
}
export function ConfirmDialog({ 
  title, 
  description, 
  onConfirm, 
  children, 
  confirmLabel = 'Потвърди', 
  cancelLabel = 'Откажи', 
  variant = 'destructive', 
  disabled = false, 
}: ConfirmDialogProps) { 
  const [open, setOpen] = useState(false) 
  const [isLoading, setIsLoading] = useState(false) 
 
  const handleConfirm = async () => { 
    setIsLoading(true) 
    try { 
      await onConfirm() 
      setOpen(false) 
    } catch (error) { 
      console.error('Confirm action error:', error) 
    } finally { 
      setIsLoading(false) 
    } 
  } 
 
  return ( 
    <AlertDialog open={open} onOpenChange={setOpen}> 
      {children({ onClick: () => setOpen(true), disabled })} 
      <AlertDialogContent> 
        <AlertDialogHeader> 
          <AlertDialogTitle>{title}</AlertDialogTitle> 
          <AlertDialogDescription>{description}</AlertDialogDescription> 
        </AlertDialogHeader> 
        <AlertDialogFooter> 
          <AlertDialogCancel disabled={isLoading}> 
            {cancelLabel} 
          </AlertDialogCancel> 
          <AlertDialogAction 
            onClick={(e) => { 
              e.preventDefault() 
              handleConfirm() 
            }} 
            disabled={isLoading} 
            variant={variant} 
            > 
            {isLoading && <Spinner />} 
            {confirmLabel} 
          </AlertDialogAction> 
        </AlertDialogFooter> 
      </AlertDialogContent> 
    </AlertDialog> 
  ) 
}