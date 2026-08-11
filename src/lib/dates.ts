export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return '';
  const iso = String(value).split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso) && Number(iso.slice(0, 4)) >= 1000) {
    return iso;
  }
  const date = new Date(String(value));
  if (!isNaN(date.getTime()) && date.getFullYear() >= 1000) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
  return '';
}

export function normalizeDateInput(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (!isNaN(date.getTime()) && date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d) {
      return trimmed;
    }
    return undefined;
  }
  const date = new Date(trimmed);
  if (isNaN(date.getTime()) || date.getFullYear() < 1000) return undefined;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
