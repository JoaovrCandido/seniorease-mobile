import { render } from "@testing-library/react-native";
import {
  UserProfileProvider,
  useUserProfile,
} from "../../../src/presentation/store/UserProfileContext";

describe("UserProfileContext", () => {
  it("deve inicializar o perfil do utilizador", () => {
    let profileData: unknown;
    const TestComponent = () => {
      profileData = useUserProfile();
      return null;
    };
    render(
      <UserProfileProvider>
        <TestComponent />
      </UserProfileProvider>,
    );
    expect(profileData).toBeDefined();
  });
});
