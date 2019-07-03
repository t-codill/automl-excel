export interface IComponentWithRoute<TProp> {
    routePath: string;
    new(p: Readonly<TProp>): React.Component<TProp>;
}
