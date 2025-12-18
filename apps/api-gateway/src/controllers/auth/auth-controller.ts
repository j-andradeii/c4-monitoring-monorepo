import { Body, Controller, Get, Post, Req, Res, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler"; // Import Throttle decorator
import { Request, Response } from 'express';
import { AuthMicroserviceService } from "../../microservices/auth-microservice/auth-microservice.service";
import { API_PREFIX } from "@app/libs";
import { AuthCredsDto, AuthDto, SelfInformationDto } from "@app/libs/dto/auth/auth-creds.dto";
import { AllExceptionsFilter } from "../../interceptors/exception-filter";
import { TransformResponseInterceptor } from "../../interceptors/transform-response.interceptor";
import { JwtAuthGuard } from "../../guards/guards/jwt-auth.guard";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { AuthService } from "../../service/auth.service";
import { CookieConfigService } from "../../config/cookie-config.service";


@Controller(`${API_PREFIX.V1}/auth`)
@UseFilters(AllExceptionsFilter) // ✅ Apply exception filter to this controller
export class AuthController {
    constructor(
        private authMicroserviceService: AuthMicroserviceService,
        private authService: AuthService,
        private cookieConfigService: CookieConfigService
    ) {}
    
    // Apply specific rate limit: 5 requests per 60 seconds
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getAuth(
        @Body() body: AuthCredsDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<AuthDto> {
        const tokens = await this.authMicroserviceService.authenticateUser(body);

        // Set cookies for web clients
        res.cookie(
            this.cookieConfigService.COOKIE_NAMES.ACCESS_TOKEN,
            tokens.access_token,
            this.cookieConfigService.getAccessTokenCookieOptions()
        );
        res.cookie(
            this.cookieConfigService.COOKIE_NAMES.REFRESH_TOKEN,
            tokens.refresh_token,
            this.cookieConfigService.getRefreshTokenCookieOptions()
        );

        // Also return tokens in body for mobile/API clients
        return tokens;
    }


    @Get('self')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    @UsePipes(ValidationPipe) // Use the pipe on this method
    async getSelfInformation(@AuthUser() loggedInUser: any): Promise<SelfInformationDto> {
      console.log(loggedInUser);
      return await this.authService.getSelfInformation(loggedInUser.userId);
    }

    @Post('refresh')
    @UseInterceptors(TransformResponseInterceptor<any>)
    async refresh(
        @Body() body: { refresh_token?: string },
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        // Try cookie first, then body (supports both web and mobile)
        const refreshToken =
            req.cookies?.[this.cookieConfigService.COOKIE_NAMES.REFRESH_TOKEN] ||
            body.refresh_token;

        if (!refreshToken) {
            throw new Error('Refresh token not provided');
        }

        const tokens = await this.authMicroserviceService.refreshToken(refreshToken);

        // Set new cookies
        res.cookie(
            this.cookieConfigService.COOKIE_NAMES.ACCESS_TOKEN,
            tokens.access_token,
            this.cookieConfigService.getAccessTokenCookieOptions()
        );
        res.cookie(
            this.cookieConfigService.COOKIE_NAMES.REFRESH_TOKEN,
            tokens.refresh_token,
            this.cookieConfigService.getRefreshTokenCookieOptions()
        );

        // Also return tokens in body for mobile/API clients
        return tokens;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformResponseInterceptor<any>)
    async logout(@Res({ passthrough: true }) res: Response) {
        // Clear access token cookie
        res.clearCookie(
            this.cookieConfigService.COOKIE_NAMES.ACCESS_TOKEN,
            this.cookieConfigService.getClearCookieOptions()
        );
        // Clear refresh token cookie
        res.clearCookie(
            this.cookieConfigService.COOKIE_NAMES.REFRESH_TOKEN,
            this.cookieConfigService.getClearRefreshCookieOptions()
        );

        return { message: 'Logged out successfully' };
    }
}