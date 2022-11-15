import {
  ReactElement,
  // ReactNode,
  useState,
  // Fragment,
  useCallback,
} from 'react';
import styled from '@emotion/styled';
// import clsx from 'clsx';
// import { NavLink } from 'react-router-dom';
import { Theme, useTheme } from './ThemeContainer';

const LogoContainer = styled.div`
  line-height: 0;
`;

function Logo({ className }: { className: string }): ReactElement {
  return (
    <LogoContainer className={className}>
      <svg
        width="2147"
        height="600"
        viewBox="0 0 2147 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[32px] w-auto"
      >
        <rect
          x="117.36"
          y="122.223"
          width="361.737"
          height="355.553"
          fill="#5BABCD"
        />
        <rect
          x="298.228"
          y="46.3998"
          width="361.737"
          height="355.553"
          transform="rotate(45 298.228 46.3998)"
          fill="#5BABCD"
        />
        <path
          d="M711.229 458.022V198.127C711.229 183.607 709.092 171.992 704.818 163.28C700.872 154.246 691.501 149.729 676.704 149.729H668.319V138.597H716.655C728.163 138.597 737.041 140.211 743.289 143.437C749.865 146.664 754.469 152.633 757.099 161.344C759.73 169.733 761.045 181.994 761.045 198.127V283.307H905.065V138.597H954.388V398.493C954.388 413.013 956.36 424.789 960.306 433.824C964.581 442.535 974.116 446.891 988.913 446.891H997.791V458.022H949.455C937.947 458.022 928.904 456.57 922.328 453.667C916.081 450.44 911.642 444.471 909.011 435.759C906.381 427.048 905.065 414.626 905.065 398.493V303.15H761.045V458.022H711.229Z"
          fill="currentColor"
        />
        <path
          d="M1017.84 458.022L1155.19 139.02H1157.78L1295.14 458.022H1243.03L1143.14 208.313L1175.43 187.61L1062.62 458.022H1017.84ZM1100.94 343.097H1212.89L1228.39 381.124H1087.59L1100.94 343.097Z"
          fill="currentColor"
        />
        <path
          d="M1544.46 414.925H1649.96V458.022H1484.61L1544.46 414.925ZM1317.11 305.07C1317.11 283.944 1321.13 263.945 1329.17 245.072C1337.49 226.2 1348.98 209.581 1363.62 195.215C1378.26 180.568 1395.19 169.16 1414.43 160.991C1433.66 152.541 1454.18 148.315 1476 148.315C1497.82 148.315 1518.34 152.541 1537.57 160.991C1557.09 169.16 1574.17 180.568 1588.81 195.215C1603.74 209.581 1615.37 226.2 1623.69 245.072C1632.02 263.945 1636.18 283.944 1636.18 305.07C1636.18 326.76 1632.02 347.041 1623.69 365.913C1615.37 384.786 1603.74 401.405 1588.81 415.77C1574.17 430.136 1557.09 441.403 1537.57 449.572C1518.34 457.459 1497.82 461.403 1476 461.403C1454.18 461.403 1433.66 457.459 1414.43 449.572C1395.19 441.403 1378.26 430.277 1363.62 416.193C1348.98 402.109 1337.49 385.631 1329.17 366.758C1321.13 347.604 1317.11 327.041 1317.11 305.07ZM1363.62 305.493C1363.62 326.055 1368.64 344.928 1378.69 362.11C1388.73 379.293 1402.37 392.954 1419.59 403.095C1436.82 413.235 1456.05 418.306 1477.29 418.306C1498.25 418.306 1517.19 413.235 1534.13 403.095C1551.07 392.954 1564.56 379.293 1574.61 362.11C1584.65 344.928 1589.68 325.915 1589.68 305.07C1589.68 289.578 1586.66 275.071 1580.63 261.551C1574.89 247.748 1566.85 235.777 1556.52 225.637C1546.19 215.214 1534.13 207.046 1520.35 201.13C1506.86 195.215 1492.22 192.257 1476.43 192.257C1455.19 192.257 1435.96 197.469 1418.73 207.891C1401.8 218.031 1388.3 231.693 1378.26 248.875C1368.5 266.058 1363.62 284.93 1363.62 305.493Z"
          fill="currentColor"
        />
        <path
          d="M1926.7 414.925H2032.19V458.022H1866.84L1926.7 414.925ZM1699.35 305.07C1699.35 283.944 1703.36 263.945 1711.4 245.072C1719.73 226.2 1731.21 209.581 1745.85 195.215C1760.49 180.568 1777.43 169.16 1796.66 160.991C1815.89 152.541 1836.42 148.315 1858.23 148.315C1880.05 148.315 1900.57 152.541 1919.81 160.991C1939.33 169.16 1956.41 180.568 1971.05 195.215C1985.97 209.581 1997.6 226.2 2005.93 245.072C2014.25 263.945 2018.41 283.944 2018.41 305.07C2018.41 326.76 2014.25 347.041 2005.93 365.913C1997.6 384.786 1985.97 401.405 1971.05 415.77C1956.41 430.136 1939.33 441.403 1919.81 449.572C1900.57 457.459 1880.05 461.403 1858.23 461.403C1836.42 461.403 1815.89 457.459 1796.66 449.572C1777.43 441.403 1760.49 430.277 1745.85 416.193C1731.21 402.109 1719.73 385.631 1711.4 366.758C1703.36 347.604 1699.35 327.041 1699.35 305.07ZM1745.85 305.493C1745.85 326.055 1750.87 344.928 1760.92 362.11C1770.97 379.293 1784.6 392.954 1801.83 403.095C1819.05 413.235 1838.28 418.306 1859.52 418.306C1880.48 418.306 1899.43 413.235 1916.36 403.095C1933.3 392.954 1946.79 379.293 1956.84 362.11C1966.88 344.928 1971.91 325.915 1971.91 305.07C1971.91 289.578 1968.89 275.071 1962.87 261.551C1957.12 247.748 1949.09 235.777 1938.75 225.637C1928.42 215.214 1916.36 207.046 1902.58 201.13C1889.09 195.215 1874.45 192.257 1858.66 192.257C1837.42 192.257 1818.19 197.469 1800.96 207.891C1784.03 218.031 1770.54 231.693 1760.49 248.875C1750.73 266.058 1745.85 284.93 1745.85 305.493Z"
          fill="currentColor"
        />
      </svg>
    </LogoContainer>
  );
}

// interface HeaderLinkProps {
//   href: string;
//   className?: string;
//   isActive: boolean;
//   children: ReactNode;
// }

// function HeaderLink({ children, href, className }: HeaderLinkProps) {
//   return (
//     <NavLink
//       to={href}
//       className={({ isActive }) => {
//         return clsx(
//           'block sm:inline-block px-3 py-2 rounded-md text-base sm:text-sm font-medium',
//           isActive
//             ? 'bg-gray-700/20 text-white'
//             : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//           className,
//         );
//       }}
//     >
//       {children}
//     </NavLink>
//   );
// }

function ThemeButton() {
  const { theme, changeTheme } = useTheme();

  const handleThemeChange = useCallback(() => {
    changeTheme(theme === Theme.dark ? Theme.light : Theme.dark);
  }, [changeTheme, theme]);

  return (
    <button
      type="button"
      onClick={handleThemeChange}
      className="rounded-md p-[6px] hover:bg-gray-900/10 dark:hover:bg-gray-100/10"
    >
      <span className="sr-only">Change theme</span>

      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            theme === Theme.dark
              ? 'M12 9C13.65 9 15 10.35 15 12C15 13.65 13.65 15 12 15C10.35 15 9 13.65 9 12C9 10.35 10.35 9 12 9ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM2 13H4C4.55 13 5 12.55 5 12C5 11.45 4.55 11 4 11H2C1.45 11 1 11.45 1 12C1 12.55 1.45 13 2 13ZM20 13H22C22.55 13 23 12.55 23 12C23 11.45 22.55 11 22 11H20C19.45 11 19 11.45 19 12C19 12.55 19.45 13 20 13ZM11 2V4C11 4.55 11.45 5 12 5C12.55 5 13 4.55 13 4V2C13 1.45 12.55 1 12 1C11.45 1 11 1.45 11 2ZM11 20V22C11 22.55 11.45 23 12 23C12.55 23 13 22.55 13 22V20C13 19.45 12.55 19 12 19C11.45 19 11 19.45 11 20ZM5.99 4.58C5.6 4.19 4.96 4.19 4.58 4.58C4.19 4.97 4.19 5.61 4.58 5.99L5.64 7.05C6.03 7.44 6.67 7.44 7.05 7.05C7.43 6.66 7.44 6.02 7.05 5.64L5.99 4.58ZM18.36 16.95C17.97 16.56 17.33 16.56 16.95 16.95C16.56 17.34 16.56 17.98 16.95 18.36L18.01 19.42C18.4 19.81 19.04 19.81 19.42 19.42C19.81 19.03 19.81 18.39 19.42 18.01L18.36 16.95ZM19.42 5.99C19.81 5.6 19.81 4.96 19.42 4.58C19.03 4.19 18.39 4.19 18.01 4.58L16.95 5.64C16.56 6.03 16.56 6.67 16.95 7.05C17.34 7.43 17.98 7.44 18.36 7.05L19.42 5.99ZM7.05 18.36C7.44 17.97 7.44 17.33 7.05 16.95C6.66 16.56 6.02 16.56 5.64 16.95L4.58 18.01C4.19 18.4 4.19 19.04 4.58 19.42C4.97 19.8 5.61 19.81 5.99 19.42L7.05 18.36Z'
              : 'M13.1029 7.74566C13.1908 7.74566 13.2468 7.68401 13.2627 7.59923C13.5105 6.31985 13.5025 6.28902 14.8931 6.03468C14.981 6.01156 15.045 5.96532 15.045 5.87283C15.045 5.77264 14.981 5.7264 14.8931 5.71098C13.5025 5.44123 13.5425 5.4104 13.2627 4.13873C13.2468 4.05395 13.1908 4 13.1029 4C13.007 4 12.951 4.05395 12.9351 4.13873C12.6553 5.4104 12.7033 5.44123 11.3047 5.71098C11.2168 5.7264 11.1608 5.77264 11.1608 5.87283C11.1608 5.96532 11.2168 6.01156 11.3047 6.03468C12.7033 6.30443 12.6793 6.31985 12.9351 7.59923C12.951 7.68401 13.007 7.74566 13.1029 7.74566ZM16.9231 12.9557C17.0669 12.9557 17.1708 12.8555 17.1948 12.7091C17.4505 10.6435 17.5624 10.5973 19.7283 10.2582C19.8961 10.2351 20 10.1503 20 9.99615C20 9.84971 19.8961 9.76493 19.7602 9.7341C17.5784 9.33333 17.4505 9.34875 17.1948 7.28324C17.1708 7.1368 17.0669 7.03661 16.9231 7.03661C16.7792 7.03661 16.6673 7.1368 16.6513 7.27553C16.3796 9.36416 16.2997 9.43353 14.0859 9.7341C13.95 9.75723 13.8462 9.84971 13.8462 9.99615C13.8462 10.1426 13.95 10.2351 14.0859 10.2582C16.2997 10.6667 16.3716 10.6667 16.6513 12.7245C16.6673 12.8555 16.7792 12.9557 16.9231 12.9557ZM10.9051 20C13.7902 20 16.1319 18.6127 17.2028 16.2158C17.3227 15.9383 17.3067 15.7071 17.1628 15.5607C17.043 15.4528 16.8272 15.4297 16.5794 15.5222C15.9241 15.7765 15.1648 15.8921 14.2937 15.8921C10.6813 15.8921 8.33966 13.711 8.33966 10.2813C8.33966 9.41041 8.50749 8.43931 8.77922 7.90751C8.92308 7.63006 8.91508 7.39884 8.7952 7.25241C8.65934 7.09827 8.41159 7.07514 8.09191 7.19846C5.63836 8.13873 4 10.6127 4 13.4412C4 17.1869 6.86114 20 10.9051 20Z'
          }
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function Header(): ReactElement {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleBurgerMenuClick = useCallback(() => {
    setDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen, setDropdownOpen]);

  // const headerLinks = (
  //   <Fragment>
  //     <HeaderLink href="/" isActive>
  //       Faucet
  //     </HeaderLink>
  //     <HeaderLink href="/adad" isActive>
  //       404
  //     </HeaderLink>
  //   </Fragment>
  // );

  return (
    <header className="backdrop-filter backdrop-blur transform-gpu bg-white/30 dark:bg-slate-600/10">
      <nav className="">
        <div className="container px-2 sm:px-6 lg:px-8 mx-auto">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>

                {/* <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  onClick={handleBurgerMenuClick}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg> */}

                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  onClick={handleBurgerMenuClick}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="h-8 w-auto" />
              </div>
              {/* <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">{headerLinks}</div>
              </div> */}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <ThemeButton />
              {/*
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div>

                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                  >
                    Sign out
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="sm:hidden" id="mobile-menu">
            {/* <div className="px-2 pt-2 pb-3 space-y-1">{headerLinks}</div> */}
          </div>
        )}
      </nav>
    </header>
  );
}
