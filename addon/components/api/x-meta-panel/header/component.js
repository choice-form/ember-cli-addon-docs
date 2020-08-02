import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  layout: hbs`
    <h4 class="mb-2 text-gray font-bold tracking-wide uppercase text-2xs">
      {{yield}}
    </h4>
  `,
});
