import { useMemo } from 'react';
import { Chain } from 'wagmi/chains';
import { HeaderLink } from '@haqq/shell-ui-kit';
import { useHeaderLinks } from '../config/use-header-links';

export function useFilteredLinks(chain: Chain) {
  const headerLinks = useHeaderLinks();
  const links = useMemo(() => {
    return headerLinks
      .map((link) => {
        if (link.type === 'dropdown') {
          const filteredChildren = link.children.filter((child) => {
            return !child.chains || child.chains.includes(chain.id);
          });
          if (filteredChildren.length > 0) {
            return { ...link, children: filteredChildren };
          }
          return null;
        }

        if (link.type === 'link' && link.chains.includes(chain.id)) {
          return link;
        }

        return null;
      })
      .filter(Boolean) as HeaderLink[];
  }, [chain.id, headerLinks]);

  return links;
}
