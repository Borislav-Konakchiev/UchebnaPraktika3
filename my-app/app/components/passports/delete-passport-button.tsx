import { useNavigate } from 'react-router' 
import { Button, buttonVariants } from '~/components/ui/button' 
import { TrashIcon } from 'lucide-react' 
import useFetch from '~/lib/hooks/use-fetch.hook' 
import { getApiUrl } from '~/lib/utils' 
import { ConfirmDialog } from '~/components/core/confirm-dialog' 
import type { Passport } from '~/models/passports.models' 
import type { VariantProps } from 'class-variance-authority' 
 
export type DeletePassportButtonProps = { 
  passport: Passport 
  size?: VariantProps<typeof buttonVariants>['size'] 
  showLabel?: boolean 
  onDeleteSuccess?: () => void 
} 
 
export function DeletePassportButton({ 
  passport, 
  size = 'default', 
  showLabel = true, 
  onDeleteSuccess, 
}: DeletePassportButtonProps) { 
  const navigate = useNavigate() 
  const { fetch, isLoadingRef } = useFetch() 
 
  const handleDelete = async () => { 
    try { 
      const apiUrl = getApiUrl(`/passports/${passport.id}`) 
      await fetch(apiUrl, 'DELETE') 
 
      if (onDeleteSuccess) { 
        onDeleteSuccess() 
      } else { 
        navigate('/passports', { replace: true }) 
      } 
    } catch (err) { 
      console.error('Delete passport error:', err) 
    } 
  } 
 
  return ( 
    <ConfirmDialog 
      title='Изтриване на паспорт' 
      description={`Сигурни ли сте, че искате да изтриете паспорт 
"${passport.name}"? Това действие не може да бъде отменено.`} 
      confirmLabel='Изтрий' 
      cancelLabel='Откажи' 
      variant='destructive' 
      onConfirm={handleDelete} 
      disabled={isLoadingRef.current} 
    > 
      {({ onClick, disabled }) => ( 
        <Button 
          size={size} 
          variant='destructive' 
          onClick={onClick} 
          disabled={disabled} 
> 
<TrashIcon /> 
{showLabel && 'Изтрий'} 
</Button> 
)} 
</ConfirmDialog> 
) 
} 