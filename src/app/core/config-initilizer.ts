import {ConfigService} from "../services/config.service";

export function provideConfigInitializer(configService: ConfigService) {
  return () => configService.loadConfig();
}
