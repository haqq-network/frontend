import { useMemo } from 'react';
import { Chain } from 'wagmi/chains';
import { HeaderLink } from '@haqq/shell-ui-kit';
import { headerLinks } from '../config/header-links';

export function useFilteredLinks(chain: Chain) {
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
  }, [chain.id]);

  return links;
}
