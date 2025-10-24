import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Bills of Exchange',
    tagline: 'Electronic Bills of Exchange on Decentralized Ledger',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://bill-of-exchange.github.io',
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
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like HTML lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

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
                src: 'img/logo_teal.svg',
            },
            items: [
                {to: '/manage', label: 'Manage', position: 'left'},
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
            copyright: `Copyright © ${new Date().getFullYear()} Viktor Ageyev`,
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
