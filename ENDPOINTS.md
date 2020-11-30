# API JMRICOMA

### **BD**
- Services
    - id (pk)
    - name
- Projects
    - id (pk)
    - idService (fk)
    - name
    - url
    - description

### **ENDPOINTS**

|method|endpoint|
|:--|:--|
|GET|**/services**|
|GET|**/services/{id}**|
|POST|**/services/create**|
|PATCH|**/services/{id}/update**|
|DELETE|**/services/{id}/destroy**|
|GET|**/projects**|
|GET|**/projects/{id}**|
|POST|**/projects/create**|
|PATCH|**/projects/{id}/update**|
|DELETE|**/projects/{id}/destroy**|