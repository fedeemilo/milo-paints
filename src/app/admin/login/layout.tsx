// Este layout override el admin layout para la página de login
// No muestra sidebar ni requiere autenticación

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
