import { ReactElement } from 'react';
import { Container } from './Components';

export function Footer(): ReactElement {
  return (
    <footer className="bg-light-green">
      <Container className="border-t border-gray-400/20 dark:border-gray-600/80 py-4">
        <nav className="flex flex-col justify-between items-center sm:flex-row space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:justify-center space-y-2 sm:space-y-0">
            <div className="text-sm sm:mb-0 text-gray-400 dark:text-gray-600/80">
              <span role="img" aria-label="copyright">
                ©️ {new Date().getFullYear()}{' '}
              </span>
              <a
                href="https://haqq.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary transition-colors duration-200 ease-out"
              >
                HAQQ Network
              </a>
              &nbsp;
            </div>

            <div className="text-sm text-gray-400 dark:text-gray-600/80 self-center sm:mb-0">
              All rights reserved
            </div>
          </div>
          <div className="flex flex-row sm:space-x-4 items-center">
            {/* RIGHT SLOT */}
          </div>
        </nav>
      </Container>
    </footer>
  );
}
