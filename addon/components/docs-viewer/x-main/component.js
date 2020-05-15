import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';
import { computed } from '@ember/object';
import appFiles from 'ember-cli-addon-docs/app-files';
import addonFiles from 'ember-cli-addon-docs/addon-files';
import config from 'ember-get-config';
import { getOwner } from '@ember/application';

import layout from './template';

const tagToSize = { H2: '2xs', H3: '2xs' };
const tagToIndent = { H2: '0', H3: '4' };
const tagToMarginTop = { H2: '2', H3: '2' };
const tagToMarginBottom = { H2: '0', H3: '0' };

export default Component.extend({
  layout,

  router: service(),
  docsRoutes: service(),

  tagName: 'main',
  classNames: [
    'm:px-4 t:px-8 d:px-16 od:px-20',
    'm:mt-6 t:mt-8 d:mt-16 od:mt-20',
    'mx-auto',
    'min-w-0',
    'flex-1',
  ],

  didInsertElement() {
    this._super(...arguments);

    let target = this.element.querySelector('[data-current-page-index-target]');

    this._mutationObserver = new MutationObserver(
      bind(this, this.reindex, target)
    );

    this._mutationObserver.observe(target, { subtree: true, childList: true });

    this.reindex(target);
  },

  willDestroyElement() {
    this._super(...arguments);

    this._mutationObserver.disconnect();
  },

  reindex(target) {
    let headers = Array.from(
      target.querySelectorAll('.h2, .h3, .md__h2, .md__h3')
    );

    this.onReindex(
      headers.map((header) => {
        return {
          id: header.id,
          text: header.dataset.text || header.textContent,
          size: tagToSize[header.tagName],
          indent: tagToIndent[header.tagName],
          marginTop: tagToMarginTop[header.tagName],
          marginBottom: tagToMarginBottom[header.tagName],
        };
      })
    );
  },

  editCurrentPageUrl: computed('router.currentRouteName', function () {
    let path = this.get('router.currentRouteName');
    if (!path) {
      // `router` doesn't exist for old ember versions via ember-try
      return;
    }

    let match = this._locateFile(path);
    if (match) {
      let {
        projectHref,
        addonPathInRepo,
        docsAppPathInRepo,
        primaryBranch,
      } = config['ember-cli-addon-docs'];
      let parts = [projectHref, 'edit', primaryBranch];
      if (match.inTree === 'addon') {
        parts.push(addonPathInRepo);
      } else {
        parts.push(docsAppPathInRepo);
      }
      parts.push(match.file);
      return parts.filter(Boolean).join('/');
    }
  }),

  _locateFile(path) {
    path = path.replace(/\./g, '/');
    if (path === 'docs/api/item') {
      let { projectName } = config['ember-cli-addon-docs'];
      let model = getOwner(this)
        .lookup('route:application')
        .modelFor('docs.api.item');
      let filename = model
        .get('file')
        .replace(new RegExp(`^${projectName}/`), '');
      let file = addonFiles.find((f) => f.match(filename));
      if (file) {
        return { file, inTree: 'addon' };
      }
    } else {
      let file = appFiles
        .filter((file) => file.match(/\.(hbs|md)$/))
        .find((file) => file.match(path));
      if (file) {
        return { file, inTree: 'app' };
      }
    }
  },
});
