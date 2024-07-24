export type NavItem = {
  id: string
  label: string
  route: string
}

export type HeaderNavItem = {
  id: string
  title: string
  route: string
  description: string
}

export type HeaderNav = {
  id: string
  label: string
  components: HeaderNavItem[]
}
