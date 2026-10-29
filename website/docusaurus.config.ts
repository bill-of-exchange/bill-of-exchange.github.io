import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Wallet libraries pulled in by wagmi import optional packages needed only by features this site
// never uses. The bundler fails (or warns) on such imports when the packages are
// not installed, so they are resolved to an empty module instead of being shipped:
// - `pino-pretty`: an optional `require` in `pino` (via @walletconnect/logger), reached only
//   when pretty-printed logging is enabled, which nothing here does;
// - `@x402/*`: optional peer dependencies of @coinbase/cdp-sdk (via @wagmi/connectors →
//   @base-org/account), reached only by x402 HTTP payments. An alias also covers subpaths
//   such as `@x402/core/client`.
const UNUSED_OPTIONAL_DEPENDENCIES = [
    'pino-pretty',
    '@x402/core',
    '@x402/evm',
    '@x402/svm',
    '@x402/extensions',
    '@x402/express',
    '@x402/fetch',
];

const config: Config = {
    title: 'Bills of Exchange',
    tagline: 'Electronic Bills of Exchange on Decentralized Ledger',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    // The custom domain served by GitHub Pages: canonical links, the sitemap and social cards use it.
    url: 'https://bills-of-exchange.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // https://docusaurus.io/docs/api/docusaurus-config#trailingSlash
    trailingSlash: true, // ← ensure all pages use trailing slash

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'bill-of-exchange', // Usually your GitHub org/username.
    projectName: 'bill-of-exchange.github.io', // Usually your repo name.

    onBrokenLinks: 'throw',
    // Moved here from the top-level `onBrokenMarkdownLinks` (deprecated since 3.9, removed in v4)
    markdown: {
        // .md → plain CommonMark, .mdx → MDX (default 'mdx' would compile .md as MDX too)
        format: 'detect',
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like HTML lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    plugins: [
        () => ({
            name: 'ignore-unused-optional-dependencies',
            configureWebpack: () => ({
                resolve: {
                    alias: Object.fromEntries(UNUSED_OPTIONAL_DEPENDENCIES.map((name) => [name, false])),
                },
            }),
        }),
    ],

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/bill-of-exchange/bill-of-exchange.github.io/tree/master/website/',
                    showLastUpdateAuthor: true, // git username from the last commit
                    showLastUpdateTime: true, // git last commit time
                },
                blog: {
                    // showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/bill-of-exchange/bill-of-exchange.github.io/tree/master/website/',
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                    //
                    showLastUpdateAuthor: true, // git username from the last commit
                    showLastUpdateTime: true, // git last commit time
                    //
                    blogSidebarCount: 12, // Set the number of recent posts
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
                sitemap: {
                    // Developer-only pages: see src/pages/playground.tsx.
                    ignorePatterns: ['/playground/**'],
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace it with your project's social card
        // image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            defaultMode: 'dark', // 'light',
            disableSwitch: false,
            respectPrefersColorScheme: false, // false,
        },
        navbar: {
            title: 'Bills of Exchange',
            logo: {
                alt: 'Logo',
                src: 'img/logos/logo.svg', //
            },
            items: [
                {to: '/wallet', label: 'My bills', position: 'left'},
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Documentation',
                },
                {to: '/blog', label: 'Blog', position: 'left'},
                // ===  Wagmi buttons
                {type: 'custom-chainSwitcher', position: 'right'},
                {type: 'custom-connectButtons', position: 'right'},
                // ===
                {
                    href: 'https://github.com/bill-of-exchange/bill-of-exchange.github.io',
                    label: 'GitHub',
                    position: 'right',
                    mobile: false // 👈 here
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Documentation',
                    items: [
                        {
                            label: 'Docs',
                            to: '/docs/intro/',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/bill-of-exchange/bill-of-exchange.github.io',
                        },
                    ],
                },
                /* {
                   title: 'Community',
                   items: [
                     {
                       label: 'Stack Overflow',
                       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                     },
                     {
                       label: 'Discord',
                       href: 'https://discordapp.com/invite/docusaurus',
                     },
                     {
                       label: 'X',
                       href: 'https://x.com/docusaurus',
                     },
                   ],
                 },*/
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                    ],
                },
            ],
            // Rendered as HTML (src/theme/Footer/Copyright), so it may contain a link.
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/ageyev/" target="_blank" rel="noopener noreferrer">Viktor Ageyev</a>`,
        },
        // https://docusaurus.io/docs/markdown-features/code-blocks#theming
        prism: {
            // theme: prismThemes.github,
            theme: prismThemes.gruvboxMaterialLight,
            // darkTheme: prismThemes.dracula,
            darkTheme: prismThemes.gruvboxMaterialDark,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
