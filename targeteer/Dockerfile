FROM maven:3.9.6-eclipse-temurin-21 as builder
WORKDIR /opt/app
COPY pom.xml ./
COPY ./src ./src

RUN mvn clean install -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /opt/app
EXPOSE 8080
COPY --from=builder /opt/app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]