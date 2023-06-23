import styles from './islamic-website-ui-kit.module.css';

/* eslint-disable-next-line */
export interface IslamicWebsiteUiKitProps {}

export function IslamicWebsiteUiKit(props: IslamicWebsiteUiKitProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to IslamicWebsiteUiKit!</h1>
    </div>
  );
}

export default IslamicWebsiteUiKit;
