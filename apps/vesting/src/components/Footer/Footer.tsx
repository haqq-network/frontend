import { ReactElement } from 'react';
import { Container } from '../Layout/Layout';
// import { config } from '../../config';
import { Text } from '../Typography/Typography';
// import { repository } from '../../../../../package.json';

export function Footer(): ReactElement {
  return (
    <footer className="bg-light-green">
      <Container className="border-t border-light-gray py-4">
        <nav className="flex flex-col justify-between items-center sm:flex-row space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:justify-center space-y-2 sm:space-y-0">
            <Text color="light" className="text-sm sm:mb-0">
              ©️ {new Date().getFullYear()}{' '}
              <a
                href="https://haqq.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary transition-colors duration-200 ease-out"
              >
                HAQQ Network.
              </a>
              &nbsp;
            </Text>
            <Text color="light" className="text-sm self-center sm:mb-0">
              All rights reserved
            </Text>
          </div>
          <div className="flex flex-row sm:space-x-4 items-center">
            {/* <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-colors duration-200 hover:text-primary text-dark-gray ease-out hidden sm:block"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="w-[22px] h-[22px]"
              >
                <path
                  fillRule="evenodd"
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                ></path>
              </svg>
            </a> */}

            {/* <div className="text-sm text-dark-gray">
              version: {config.version}
            </div> */}
          </div>
        </nav>
      </Container>
    </footer>
  );
}
