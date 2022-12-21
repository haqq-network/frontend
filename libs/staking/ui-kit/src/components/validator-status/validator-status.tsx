import { Badge } from '@haqq/ui-kit';

export function ValidatorStatus({
  jailed,
  status,
}: {
  jailed: boolean;
  status: number;
}) {
  if (jailed) {
    return <Badge intent="danger">Jailed</Badge>;
  }

  if (status === 3) {
    return <Badge intent="success">Active</Badge>;
  }

  return <Badge intent="warning">Inactive</Badge>;
}
