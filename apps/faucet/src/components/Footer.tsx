import { Container } from '@haqq/ui-kit';
import { ReactElement } from 'react';

export function Footer(): ReactElement {
  return (
    <footer className="bg-light-green">
      <Container className="border-t border-gray-400/20 py-4 dark:border-gray-600/80">
        <nav className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:justify-center sm:space-y-0">
            <div className="text-sm text-gray-400 dark:text-gray-600/80 sm:mb-0">
              <span role="img" aria-label="copyright">
                ©️ {new Date().getFullYear()}{' '}
              </span>
              <a
                href="https://haqq.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary underline underline-offset-2 transition-colors duration-200 ease-out"
              >
                HAQQ Network
              </a>
              &nbsp;
            </div>

            <div className="self-center text-sm text-gray-400 dark:text-gray-600/80 sm:mb-0">
              All rights reserved
            </div>
          </div>
          <div className="flex flex-row items-center sm:space-x-4">
            {/* RIGHT SLOT */}
          </div>
        </nav>
      </Container>
    </footer>
  );
}
