# Martinglae {{pack.name}} Pack

**Name:** {{pack.name}}

{{pack.description}}

{{#if pack.pages}}
## Included Pages
{{#each pack.pages}}
### {{@key}}: {{#if sideNav}}Side Nav{{/if}}

{{#if icon}}
{{#if icon.source}}
<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="64" width="64" viewBox="0 0 {{icon.width}} {{icon.height}}" style="vertical-align: middle;">
  <g>
    {{{icon.source}}}
  </g>
</svg>
{{/if}}
{{/if}}
{{#if description}}
{{description}}

{{/if}}
{{#if icon}}
{{#if icon.source}}
{{else}}
**Icon:** {{icon}}
{{/if}}

{{/if}}
{{#if dynamicPath}}
**Dynamic Path:** {{dynamicPath}}

{{/if}}
{{#if path}}
**Path:** {{path}}

{{/if}}
{{#if paths}}
{{#each paths}}
**Path:** {{this}}

{{/each}}
{{/if}}

{{/each}}
{{/if}}

{{#if pack.sideNav}}
{{/if}}
