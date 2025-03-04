import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A7A8D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSection: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '30%',
    backgroundColor: '#8A8BCB',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  formContainer: {
    backgroundColor: '#D2D3EB',
    width: '90%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6B6DAE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  googleSignInButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  googleLogo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    color: '#6B6DAE',
    fontWeight: 'bold',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '8%',
    backgroundColor: '#6B6DAE',
  },

  googleButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default styles;