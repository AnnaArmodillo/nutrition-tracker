import { getDateString } from '@/utils/getDateString'

export function getDateBefore(dateStr: string, daysBefore: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() - daysBefore)
  return getDateString(date)
}
