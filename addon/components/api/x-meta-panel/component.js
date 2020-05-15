import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <div class="px-6 pt-3 mt-4 border border-gray-3 rounded text-xs">
      {{yield (hash
        header=(component 'api/x-meta-panel/header')
      )}}
    </div>
  `,
});
