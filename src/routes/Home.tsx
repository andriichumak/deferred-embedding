import React from "react";

import Page from "../components/Page";
import { UserRoleProvider } from "../contexts/UserRole";
import { Slot } from "../deferred-embedding/Slot";
import { newPositiveAttributeFilter, newAttribute } from "@gooddata/sdk-model";

const filter = newPositiveAttributeFilter(newAttribute("products.category"), ["Electronics"]);

const Home: React.FC = () => {
    return <Page>
        <UserRoleProvider role="viewer">
            <h3>Here we are a viewer user</h3>
            <h4>Slot "my-slot"</h4>
            <div style={{height: 500, width: 500, background: "#eee"}}>
                <Slot name="my-slot" />
            </div>
            <h4>Slot "my-other-slot"</h4>
            <div style={{height: 500, width: 500, background: "#eee"}}>
                <Slot name="my-other-slot" filters={[filter]} />
            </div>
        </UserRoleProvider>
        <UserRoleProvider role="admin">
            <h3>Here we are an admin user</h3>
            <h4>Slot "my-slot"</h4>
            <div style={{height: 500, width: 500, background: "#eee"}}>
                <Slot name="my-slot" />
            </div>
            <h4>Slot "my-other-slot"</h4>
            <div style={{height: 500, width: 500, background: "#eee"}}>
                <Slot name="my-other-slot"  filters={[filter]} />
            </div>
        </UserRoleProvider>
    </Page>;
};

export default Home;
