import NavigationLayout from "./NavigationBar";
import FooterLayout from "./footer";

export default function Layout({ children }) {
    return (
      <>
        <div />
            <NavigationLayout/>
            <main>{children}</main>
            <FooterLayout/>
        <div />
      </>
    )
  }

  