declare module '*.svg?react' {
  import React = require('react');
  
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement & { className?: string }>>;

  export default ReactComponent;
}
