import {
  highlightCode,
  default as compileMarkdown,
} from 'ember-cli-addon-docs/utils/compile-markdown';
import { module, test } from 'qunit';

module('Unit | Utility | compile-markdown', function (hooks) {
  test('should be able to highlight javascript', function (assert) {
    let result = highlightCode(`let foo = 'bar';`, 'js');
    assert.equal(
      result,
      `<span class="hljs-keyword">let</span> foo = <span class="hljs-string">'bar'</span>;`
    );
  });

  test('should render a table', function (assert) {
    let result = compileMarkdown(
      `
      | Dependency Name | Engine A | Host |
      |-----------------|----------|------|
      | Foo             | v2       | v1   |
    `.trim()
    );
    assert.equal(
      result,
      `<div class="docs-md"><table class="table-auto">
        <thead>
        <tr class="table-row">
        <th class="border px-4 py-2">Dependency Name</th>
        <th class="border px-4 py-2">Engine A</th>
        <th class="border px-4 py-2">Host</th>
        </tr>
        </thead>
        <tbody><tr class="table-row">
        <td class="border px-4 py-2">Foo</td>
        <td class="border px-4 py-2">v2</td>
        <td class="border px-4 py-2">v1</td>
        </tr>
        </tbody></table></div>
      `
    );
  });
});
