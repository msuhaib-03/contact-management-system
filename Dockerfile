FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar $(find target -maxdepth 1 -type f -name '*.jar' ! -name '*original*.jar' | head -n 1)"]
