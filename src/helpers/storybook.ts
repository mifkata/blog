import type { AstroRenderer } from "@storybook-astro/framework";
import type {
  Args,
  ComponentAnnotations,
  StoryAnnotations,
} from "storybook/internal/types";

// @storybook-astro/framework exports its renderer but no Meta or StoryObj.
type ComponentArgs<TComponent> = TComponent extends (
  props: infer TProps extends Args,
  ...rest: never[]
) => unknown
  ? TProps & { slots?: Record<string, string> }
  : Args;

export type Meta<TComponent> = ComponentAnnotations<
  AstroRenderer,
  ComponentArgs<TComponent>
>;

export type StoryObj<TComponent> = StoryAnnotations<
  AstroRenderer,
  ComponentArgs<TComponent>
>;
