import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/accounts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/accounts/"!</div>
}
