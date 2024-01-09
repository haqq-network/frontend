import { MarkdownText as MarkdownTextComponent } from './markdown-text';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MarkdownTextComponent> = {
  component: MarkdownTextComponent,
  title: 'haqq-website/ui-kit',
};

export default meta;

type Story = StoryObj<typeof MarkdownTextComponent>;

export const MarkdownText: Story = {
  args: {
    isBlack: false,
    children: `# Ultima a audistis

## Genus ad vidit

Lorem markdownum meritis leves adiciuntque mediis, hoc certa, iam quod. Venimus
spectantis datis quo adnuerat nuper, [cum](https://haqq.network/)
ursaque nefandos. Imaginis pomoque, et esset, inrequietus terra, tempora in
autem coniugis Orionis salutifer. Procul Terea flumine remittat et defuit
creditis defensae uno occupet et inguina, in haberet ferro videt tu freta
stamina. Prius curat, obest quis quoque terrae natae advena, pectore natantibus,
sacer inque, nec.

### Aetherias certior solent

Icto amat obstet, haut parvi dictis aetherias certior solent et *corporis*
fluctibus dedecus. Orbem remittit angulus obscenae seductaque
[foedus](https://haqq.network/) animalia decoro arbitrium animum, illa sonos
morti agresti et canes genitor. Ego et animal luctibus; est inque mirere tenet,
tantum.`,
  },
};
