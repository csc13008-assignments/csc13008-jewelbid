package jewelbid_dev.jewelbid.config;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SslOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public LettuceClientConfiguration lettuceClientConfiguration() {
        SslOptions sslOptions = SslOptions.builder()
                .jdkSslProvider()
                .build();

        ClientOptions clientOptions = ClientOptions.builder()
                .sslOptions(sslOptions)
                .build();

        return LettuceClientConfiguration.builder()
                .clientOptions(clientOptions)
                .useSsl()
                .build();
    }
}