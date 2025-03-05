import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View style={styles.scrWrapper}>
      <View style={styles.logoWrapper}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.logoText}>Doctor Here</Text>
      </View>
      <View style={styles.formWrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Mừng bạn trở lại!</Text>
          <Text style={styles.subtitle}>Hy vọng bạn vẫn ổn.</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Image
              source={require("../../assets/icon/user_icon.png")}
              style={styles.icon}
            />
            <TextInput style={styles.input} placeholder="Tên đăng nhập" />
          </View>
          <View style={styles.inputContainer}>
            <Image
              source={require("../../assets/icon/lock.png")}
              style={styles.icon}
            />
            <TextInput style={styles.input} placeholder="Mật khẩu" />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => alert("Đăng nhập")}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}>
          <Text style={styles.separatorText}>Hoặc</Text>
        </View>
        <View style={styles.socialWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert("Google Login")}
          >
            <Image
              source={require("../../assets/icon/google_icon.png")}
              style={styles.icon}
            />
            <Text>Đăng nhập với Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => alert("Quên mật khẩu")}>
            <Text style={styles.footerLink}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Chưa có tài khoản?{" "}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate("SignUp")}
            >
              Đăng ký
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#111928",
    alignContent: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 32,
  },
  logo: {
    width: 66,
    height: 66,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111928",
  },
  formWrapper: {
    flex: 3,
    paddingHorizontal: 20,
  },
  titleWrapper: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111928",
    alignItems: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  form: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 23,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#9CA3AF",
  },
  loginBtn: {
    borderRadius: 54,
    backgroundColor: "#1C2A3A",
    marginBottom: 23,
  },
  loginBtnText: {
    color: "#fff",
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  separator: {
    marginBottom: 23,
  },
  separatorText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
  socialWrapper: {
    marginBottom: 23,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    gap: 10,
    borderColor: "#E5E7EB",
    borderWidth: 2,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 23,
  },
  footerLink: {
    color: "#1C64F2",
    fontSize: 14,
    marginBottom: 23,
  },
});
