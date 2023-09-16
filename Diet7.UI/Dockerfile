#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Diet7.UI/Diet7.UI.csproj", "Diet7.UI/"]
RUN dotnet restore "Diet7.UI/Diet7.UI.csproj"
COPY . .
WORKDIR "/src/Diet7.UI"
RUN dotnet build "Diet7.UI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Diet7.UI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Diet7.UI.dll"]