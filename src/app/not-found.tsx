import { redirect } from 'next/navigation';

export default function NotFound(): JSX.Element {
  return redirect('/');
}
