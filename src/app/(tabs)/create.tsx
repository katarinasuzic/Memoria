import { Redirect } from 'expo-router';

/**
 * The center tab never renders its own screen — pressing it opens the `/add`
 * modal (see the tab layout's `tabBarButton` / `tabPress` handler). This
 * redirect is only a safety net if the route is reached directly.
 */
export default function CreateTabPlaceholder() {
  return <Redirect href="/add" />;
}
