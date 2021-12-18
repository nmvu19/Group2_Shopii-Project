//import part:
//base components already available in node_module:
import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import {View, ActivityIndicator, Alert}from "react-native";

//style components:
import{ StyledContainer, Innercontainer,
        StyledFormArea, StyledInputLabel, StyledTextInput,
        LeftIcon, RightIcon,
        StyledButton, ButtonText,
        Msgline,
        Colors
} from "./../components/style_components";

//icon components:
import {Octicons, Ionicons, 
        MaterialCommunityIcons
} from "@expo/vector-icons";

//scroll components:
import Scroll_component from './../components/scroll_component';

//formik:
import { Formik } from 'formik';

//Colors:
const {darklight, white, i_extra} = Colors;

//API client axios:
import axios from 'axios';


//Create username and password implementation:
const UsnPwdCreate = ({navigation, route}) =>{
    const {email, fullname, dob, phonenb, gender, address} = route.params;

    const [hidePwd, setHiddenpwd] = useState(true);
    const [hideconfirmPwd, setHiddenconfirmpwd] = useState(true);

    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleUSNPWD_Create = (credentials, setSubmitting) => {
        handleMessage(null);
        const {username, password} = credentials;
        const  url = ("https://shopii-spirit.herokuapp.com/register?" 
                    + "email=" + email 
                    + "&username=" + username + "&password=" + password 
                    + "&fullname=" + fullname + "&dob=" + dob 
                    + "&phone=" + phonenb +"&sex=" + gender 
                    + "&address=" + address);
        console.log(url);
        /* navigation.popToTop();
        setSubmitting(false); */
        axios.get(url).then((response) => {
            const result = response.data;
            const {registered, reason} = result;
            console.log(result);
            if (registered === false){
                handleMessage("Error: " + reason, false);
            }
            else{
                Alert.alert("", "Create account successfully", 
                            [{text: "continue"}]);
                navigation.popToTop();
            }
            setSubmitting(false);
        }).catch((error) => {
            console.log(error.JSON);
            setSubmitting(false);
            handleMessage("An error occurred."+ 
            "Check your network and try again.");
        });
    };

    const handleMessage = (mess, type = false) => {
        setMessage(mess);
        setMessageType(type);
    };

    return (
        <Scroll_component>
            <StyledContainer style={{paddingTop: 120}}>
                <StatusBar style="dark"/>
                <Innercontainer>
                    <Formik
                    initialValues={{username: '', password: '',
                    confirmpassword: ''}}
                    onSubmit={(values, {setSubmitting}) => {
                        if (values.username=="" || 
                            values.password=="" || 
                            values.confirmpassword==""){
                            handleMessage("Please fill all the fields.");
                            setSubmitting(false);
                        }
                        else if (values.password != values.confirmpassword){
                            handleMessage("Confirmpassword does not match"
                                        + "Password.");
                            setSubmitting(false);
                        }
                        else{
                            var count_alphabet = 0;
                            const length = values.username.length;
                            for (var i = 0; i < length; i++){
                                if (
                                    values.username.charAt(i) >= 'A' &&
                                    values.username.charAt(i) <= 'Z'
                                    || 
                                    values.username.charAt(i) >= 'a' &&
                                    values.username.charAt(i) <= 'z'
                                ){
                                    count_alphabet++;
                                }
                            }
                            if (count_alphabet == 0){
                                handleMessage("Username must have " 
                                            + "at least " 
                                            + "1 alphabet character.");
                            }
                            else{
                                handleUSNPWD_Create(values, setSubmitting);
                            }
                        }
                    }}>
                        {({handleChange, handleBlur,
                        handleSubmit, values, isSubmitting}) =>
                        (<StyledFormArea>
                            <MyTextInput
                            label="Username"
                            icon="rename-box"
                            placeholder="Username"
                            placeholderTextColor={darklight}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            isUsername={true}
                            />

                            <MyTextInput
                            label="Password"
                            icon="lock"
                            placeholder="* * * * * * * *"
                            placeholderTextColor={darklight}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry = {hidePwd}
                            isPassword={true}
                            hidePassword = {hidePwd}
                            setHiddenPassword = {setHiddenpwd}
                            />

                            <MyTextInput
                            label="Confirm password"
                            icon="lock"
                            placeholder="* * * * * * * *"
                            placeholderTextColor={darklight}
                            onChangeText={handleChange('confirmpassword')}
                            onBlur={handleBlur('confirmpassword')}
                            value={values.confirmpassword}
                            secureTextEntry = {hideconfirmPwd}
                            isConfirmPassword={true}
                            hideConfirmPassword = {hideconfirmPwd}
                            setHiddenConfirmPassword = {setHiddenconfirmpwd}
                            />

                            <Msgline type={messageType}>
                                {message}
                            </Msgline>

                            {!isSubmitting && (<StyledButton
                            onPress={handleSubmit}>
                                 <ButtonText>
                                    Sign-up
                                </ButtonText>
                                <Ionicons name="ios-create"
                                color={white} size={25}/>
                            </StyledButton>)}

                            {isSubmitting && (<StyledButton
                            disabled={true}>
                                <ActivityIndicator size="large"
                                color={white}/>
                            </StyledButton>
                            )}
                        </StyledFormArea>)}
                    </Formik>
                </Innercontainer>
            </StyledContainer>
        </Scroll_component>
    );
}

const MyTextInput = ({label, icon, isUsername, 
    isPassword, hidePassword, setHiddenPassword,
    isConfirmPassword, hideConfirmPassword, setHiddenConfirmPassword,
    ...props}) => {
    return (
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>

            {isUsername && <StyledTextInput {...props}/>}

            {!isUsername && 
                <StyledTextInput style={{paddingRight: 55}} {...props}/>}

            {isUsername && <LeftIcon style={{paddingLeft: 11}}>
                <MaterialCommunityIcons name={icon} size={30}
                color={i_extra}/>
            </LeftIcon>}

            {!isUsername && <LeftIcon>
                <Octicons name={icon} size={30} color={i_extra}/>
            </LeftIcon>}
            
            {isPassword && (
                <RightIcon onPress={() => setHiddenPassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? "md-eye-off" : "md-eye"}
                    size={30} color={darklight}/>
                </RightIcon>
            )}

            {isConfirmPassword && (
                <RightIcon onPress={() =>
                    setHiddenConfirmPassword(!hideConfirmPassword)}>
                    <Ionicons name={hideConfirmPassword ?
                    "md-eye-off" : "md-eye"}
                    size={30} color={darklight}/>
                </RightIcon>
            )}
        </View>
    )
}

export default UsnPwdCreate;