import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { userModel } from '../user/user.model';
import { User as UserInterface } from '../user/user.interface';
import { WrongAuthenticationTokenException } from '../exceptions/WrongAuthenticationTokenException';
import { WrongCredentialsException } from '../exceptions/WrongCredentialsException';
import { AuthenticationErrorException } from '../exceptions/AuthenticationErrorException';


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(
  new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password'
  },
    async (phone, password, done): Promise<void> => {
      try {
        const user = await userModel.findOne({ phone });

        if (!user) {
          return done(new WrongCredentialsException());
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password!);

        if (user.activated && isPasswordMatching) {
          user.password = undefined;
          return done(null, user);
        } else {
          return done(new WrongCredentialsException());
        }
      } catch (error) {
        return done(new AuthenticationErrorException());
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    opts,
    async (payload: { data: UserInterface }, done): Promise<void> => {
      try {
        const user = await userModel.findById(payload.data._id);

        if (user) {
          return done(null, user);
        }

        return done(new WrongAuthenticationTokenException());
      } catch (error) {
        return done(new AuthenticationErrorException());
      }
    })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});



passport.deserializeUser((id, done) => {
  userModel.findById(id, (err: mongoose.NativeError, user: UserInterface) => {
    err ? done(err) : done(null, user)
  });
});

export { passport };