import styles from './page.module.css';
import { getClientConfig } from '../config/environment';

export default function PlatformFoundationPage() {
  const config = getClientConfig();

  return (
    <main className={styles.container}>
      <section className={styles.card} aria-labelledby="platform-title">
        <span className={styles.badge}>Phase 03 Foundation Baseline</span>
        <h1 id="platform-title" className={styles.title}>
          Multi-Organization ERP &amp; Business Management Platform
        </h1>
        <p className={styles.subtitle}>
          Modular Monolith workspace initialized in JavaScript with Next.js App Router, custom CSS
          Modules, and design tokens. Application shell and domain modules follow in subsequent
          phases.
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Runtime Environment</span>
            <code className={styles.metaValue}>{config.NODE_ENV}</code>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Configured API Endpoint</span>
            <code className={styles.metaValue}>{config.NEXT_PUBLIC_API_BASE_URL}</code>
          </div>
        </div>
      </section>
    </main>
  );
}
