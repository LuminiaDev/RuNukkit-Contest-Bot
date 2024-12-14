import { FluentBundle, FluentResource, FluentVariable } from '@fluent/bundle';
import { FALLBACK_LANGUAGE } from '../api/constants';
import * as fs from 'fs';
import path from 'path';

/**
 * Directory with all translations
 */
export const localesDir = path.join(__dirname, 'locales');

export type Localizer = {
    t: (key: string, args?: Record<string, FluentVariable>) => string;
}

export class Locale {
    private bundles: Map<string, FluentBundle> = new Map();
    private defaultLocale: string;

    public constructor(localesPath: string, defaultLocale: string = 'en') {
        this.defaultLocale = defaultLocale;
        const files = fs.readdirSync(localesPath);
        for (const file of files) {
            if (file.endsWith('.ftl')) {
                const locale = file.replace('.ftl', '');
                const resource = fs.readFileSync(`${localesPath}/${file}`, 'utf8');
                const bundle = new FluentBundle(locale);
                bundle.addResource(new FluentResource(resource));
                this.bundles.set(locale, bundle);
            }
        }
        if (!this.bundles.has(defaultLocale)) {
            throw new Error(`Default locale file '${defaultLocale}.ftl' not found in ${localesPath}`);
        }
    }

    public t(locale: string, key: string, args: Record<string, FluentVariable> = {}): string {
        const bundle = this.bundles.get(locale) || this.bundles.get(this.defaultLocale)!;
        const message = bundle.getMessage(key);
        if (message?.value) {
            return bundle.formatPattern(message.value, args).replace(/\\/g, '');
        }
        return key; // Fallback to the key if the translation is missing
    }

    public getLocale(locale: string): Localizer {
        const bundle = this.bundles.get(locale) || this.bundles.get(this.defaultLocale)!;
        return {
            t: (key: string, args: Record<string, FluentVariable> = {}) => {
                const message = bundle.getMessage(key);
                if (message?.value) {
                    return bundle.formatPattern(message.value, args).replace(/\\/g, '');
                }
                return key;
            },
        };
    }
}

export const locale = new Locale(localesDir, FALLBACK_LANGUAGE);