import { HeaderNav, NavItem } from "@/types/nav"

interface Configs {
  userNav: {
    farmer: NavItem[]
    vet: NavItem[]
    admin: NavItem[]
  }
  headerNav: {
    farmer: HeaderNav[]
    vet: HeaderNav[]
    admin: HeaderNav[]
  }
  defaultHeaderNav: HeaderNav[]
}

const configs: Configs = {
  // configuration settings for user navigation
  userNav: {
    farmer: [
      {
        id: "profile",
        label: "Profile",
        route: "/profile",
      },
    ],
    vet: [
      {
        id: "profile",
        label: "Profile",
        route: "/profile",
      },
    ],

    admin: [
      {
        id: "profile",
        label: "Profile",
        route: "/profile",
      },
    ],
  },

  headerNav: {
    farmer: [
      {
        id: "consultation",
        label: "Consultation",
        components: [
          {
            id: "new-chat",
            title: "New Chat",
            description: "Start a new consultation with a veterinarian",
            route: "/new-chat",
          },
          {
            id: "chat-history",
            title: "Chat History",
            description: "Access your past chat history",
            route: "/chat-history",
          },
          {
            id: "medical-records",
            title: "Medical Records",
            description: "Access your past medical records",
            route: "/medical-records",
          },
        ],
      },
      {
        id: "subscriptions",
        label: "Subscriptions",
        components: [
          {
            id: "subscriptions",
            title: "Subscriptions",
            description: "View subscriptions",
            route: "/subscriptions",
          },
        ],
      },
      {
        id: "more",
        label: "Information",
        components: [
          {
            id: "information",
            title: "Farmer Guidelines",
            description: "Learn how to use our platform",
            route: "/blog/farmer",
          },
        ],
      },
    ],
    vet: [
      {
        id: "cms",
        label: "Blog Posts",
        components: [
          {
            id: "editor",
            title: "Blog Posts Overview",
            description: "Access all your blog posts",
            route: "/cms-editor/overview",
          },
        ],
      },
      {
        id: "consultation",
        label: "Consultation",
        components: [
          {
            id: "chat-overview",
            title: "Chat Overview",
            description: "Overview of all chats",
            route: "/chat-overview",
          },
          {
            id: "chat-history",
            title: "Chat History",
            description: "Review the chat history of your farmers",
            route: "/chat-history",
          },
          {
            id: "medical-records",
            title: "Medical Records",
            description: "View all issued medical records",
            route: "/medical-records",
          },
        ],
      },
      {
        id: "more",
        label: "Information",
        components: [
          {
            id: "information",
            title: "Platform Information",
            description: "Learn how to work with us",
            route: "/blog/veterinarian",
          },
        ],
      },
    ],
    admin: [
      {
        id: "admin",
        label: "Administration",
        components: [
          {
            id: "approve-blogpost",
            title: "Approve Blog Posts",
            description: "Approve submitted blog posts",
            route: "/approve-blogpost",
          },
          {
            id: "verify-vet",
            title: "Verify Veterinarians",
            description: "Verify veterinarian credentials",
            route: "/verify-vet",
          },
          {
            id: "all-susbcriptions",
            title: "User Subscriptions",
            description: "View all user subscriptions",
            route: "/allSubscriptions",
          },
        ],
      },
      {
        id: "cms",
        label: "Blog Posts",
        components: [
          {
            id: "editor",
            title: "Blog Posts Overview",
            description: "Access all your blog posts",
            route: "/cms-editor/overview",
          },
        ],
      },
      {
        id: "consultation",
        label: "Consultations",
        components: [
          {
            id: "chat-history",
            title: "Chat History",
            description: "View all past consultations",
            route: "/chat-history",
          },
          {
            id: "medical-records",
            title: "Medical Records",
            description: "Access all medical records",
            route: "/medical-records",
          },
        ],
      },
    ],
  },

  defaultHeaderNav: [
    {
      id: "more",
      label: "Information",
      components: [
        {
          id: "information-vet",
          title: "For Veterinarians",
          description: "Guidelines for working with us",
          route: "/blog/veterinarian",
        },
        {
          id: "information-farmer",
          title: "For Farmers",
          description: "Learn how to use our platform",
          route: "/blog/farmers",
        },
      ],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      components: [
        {
          id: "subscriptions",
          title: "Subscriptions",
          description: "View available subscription plans",
          route: "/subscriptions",
        },
      ],
    },
  ],
}

export default configs
