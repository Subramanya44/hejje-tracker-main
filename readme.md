CREATE TABLE UserGeoLocation (
    UserID INT PRIMARY KEY,
    UserName VARCHAR(50),
    Latitude DECIMAL(9,6),
    Longitude DECIMAL(9,6),
    timestamp TIMESTAMP
);



```
ng g m elephant-management
ng g m components/radio-collars-management
```

```
ng generate component components/elephant-management/add-elephant
>ng generate component components/elephant-management/list-elephant


ng generate component components/kml-management/add-kml
ng generate component components/kml-management/list-kml


ng generate component components/radio-collars-management/add-collars
ng generate component components/radio-collars-management/list-collars


ng generate component components/landmark-management/list-landmarks
ng generate component components/landmark-management/add-landmarks

ng generate component components/report-management/manage-reports