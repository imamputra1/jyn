import { Schema, Context } from 'cordis';

declare const name = "dsh-plugin-jyn";
declare const inject: string[];
interface JynConfig {
    autoOptimize: boolean;
    logRecommendations: boolean;
}
declare const Config: Schema<Schemastery.ObjectS<{
    autoOptimize: Schema<boolean, boolean>;
    logRecommendations: Schema<boolean, boolean>;
}>, Schemastery.ObjectT<{
    autoOptimize: Schema<boolean, boolean>;
    logRecommendations: Schema<boolean, boolean>;
}>>;
declare function apply(ctx: Context, config: JynConfig): void;

export { Config, apply, inject, name };
