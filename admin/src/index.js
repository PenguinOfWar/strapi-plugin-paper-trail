import { prefixPluginTranslations } from '@strapi/helper-plugin';
import * as yup from 'yup';

import pluginPkg from '../../package.json';
import CheckboxPT from './components/CheckboxPT/CheckboxPT';
import Initializer from './components/Initializer';
import PaperTrail from './components/PaperTrail/PaperTrail';
import PluginIcon from './components/PluginIcon';
import pluginId from './pluginId';
import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Paper Trail'
      },
      Component: async () => {
        const component = await import('./pages/App');
        return component;
      },
      permissions: []
    });

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'Paper Trail',
      Component: PaperTrail
    });

    const ctbPlugin = app.getPlugin('content-type-builder');

    if (ctbPlugin) {
      const ctbFormsAPI = ctbPlugin.apis.forms;

      ctbFormsAPI.components.add({
        id: 'pluginPaperTrailCheckboxConfirmation',
        component: CheckboxPT
      });

      ctbFormsAPI.extendContentType({
        validator: () => ({
          paperTrail: yup.object().shape({
            enabled: yup.bool()
          })
        }),
        form: {
          advanced() {
            return [
              {
                name: 'pluginOptions.paperTrail.enabled',
                description: {
                  id: getTrad(
                    'plugin.schema.paperTrail.description-content-type'
                  ),
                  defaultMessage:
                    'Enable Paper Trail auditing and content versioning for this content type'
                },
                type: 'pluginPaperTrailCheckboxConfirmation',
                intlLabel: {
                  id: getTrad('plugin.schema.paperTrail.label-content-type'),
                  defaultMessage: 'Paper Trail'
                }
              }
            ];
          }
        }
      });
    }
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(
          /* webpackChunkName: "pt-translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale
            };
          })
          .catch(() => {
            return {
              data: {},
              locale
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  }
};
