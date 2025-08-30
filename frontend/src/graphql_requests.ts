import {gql} from "@apollo/client";

export const GET_ALL_PRODUCTS_BY_DARKSTORE = gql`
        query getAllProductsByDarkstoreId($cond: String!){
          searchDarkstoreList(cond: $cond) {
            elems {
              count
              product {
                entity {
                  id
                  name
                  price
                  description
                }
              }
            }
          }
        }`

export const GET_ALL_DARKSTORES  = gql`
        query searchDarkstore{
          searchDarkstore {
            elems {
              id
              darkstoreAddress {
                city
                street
                building
                flatNumber
              }
            }
          }
        }`

export const CREATE_CUSTOMER = gql`
        mutation createCustomer($customerID: ID!, $firstName: String, $lastName: String){
          packet {
            createCustomer(input:{
              id: $customerID
              personalData: {
                firstName: $firstName
                lastName: $lastName
              }
            }) {
              id
            }
          }
        }`

export const SEARCH_DRAFT_ORDER = gql`
        query searchOrder($cond:String!) {
          searchOrder(cond:$cond) {
            elems {
              id
              status
              deliveryAddress {
                city
                street
                building
                flatNumber
              }
              comment
              orderDateTime
              customer {
                entity {
                  deliveryAddress {
                    city
                    street
                    building
                    flatNumber
                  }
                  personalData {
                    firstName
                    lastName
                  }
                }
              }
              orderListList {
                elems {
                  id
                  product {
                    entity {
                      id
                      name
                      price
                      description
                    }
                  }
                  count
                }
              }
            }
          }
        }`

export const CREATE_ORDER = gql`
        mutation createOrder($customerId:String!) {
          packet {
            createOrder(input: {
              customer: {
                entityId:$customerId
              }
              status:DRAFT
            }) {
              id
            }
          }
        }`

export const ADD_PRODUCT_TO_ORDER = gql`
        mutation addProductToOrder($productId:String!, $orderId:ID!, $productCount:Short) {
          packet {
            createOrderList(input: {
              product:{
                entityId:$productId
              }
              order: $orderId
              count: $productCount
            }){
              id
            }
          }
        }`

export const UPDATE_PRODUCT_COUNT = gql`
        mutation updateProductCount($orderID:ID!, $orderListId:ID!, $productId:String!, $productCount:Short) {
          packet {
            updateOrderList(input: {
              order: $orderID
              id:$orderListId
              product:{
                entityId:$productId
              }
              count: $productCount
            }){
              id
            }
          }
        }`

export const SEARCH_PRODUCT_IN_ORDER = gql`
        query searchProductInOrder($cond:String!){
          searchOrderList (cond: $cond){
            elems {
              id
              count
              product {
                entityId
              }
            }
          }
        }`

export const DELETE_PRODUCT_IN_ORDER = gql`
        mutation deleteProductFromOrder($orderListId:ID!) {
          packet {
            deleteOrderList(id: $orderListId)
          }
        }`

export const DELETE_ORDER = gql`
        mutation deleteOrder($orderId: ID!) {
          packet {
            deleteOrder (id:$orderId)
          }
        }`

export const UPDATE_ORDER = gql`
        mutation updateOrder($orderId:ID!, $deliveryCity: String!, $deliveryStreet:String!, 
          $deliveryBuilding: String, $deliveryFlatNumber:String!, $customerId: String!,
          $deliveryDate:_DateTime!,
        \t$orderComment:String){
          packet {
            updateOrder(input:{
              id:$orderId
              orderDateTime:$deliveryDate
              deliveryAddress: {
                city:$deliveryCity
                street:$deliveryStreet
                building:$deliveryBuilding
                flatNumber:$deliveryFlatNumber
              }
              customer: {
        \t\t\t\tentityId: $customerId
              }    
              comment:$orderComment
              status:FIXED
            }) {
              id
            }
          }
        }`

export const UPDATE_CUSTOMER = gql`
mutation updateCustomer($customerId: ID!, $customerCity:String!, $customerStreet:String!, 
          $customerBuilding:String, $customerFlatNumber:String!, 
          $customerFirstName:String!, $customerLastName:String!) {
          packet {
            updateCustomer (input: {
              id:$customerId
              deliveryAddress: {
                city:$customerCity
                street:$customerStreet
                building:$customerBuilding
                flatNumber:$customerFlatNumber
              }
              personalData: {
                firstName:$customerFirstName
                lastName:$customerLastName
              }
            }) {
              id
            }
          }
        }`