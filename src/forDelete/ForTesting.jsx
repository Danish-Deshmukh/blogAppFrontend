import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {moderateScale} from 'react-native-size-matters';

const ForTesting = () => {
    const code = `public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }
  public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }
      
  public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }


  public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }


  public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }


  public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }


  public class YieldExample {
      public static void main(String[] args) {
          Thread thread = new Thread(() -> {
              for (int i = 0; i < 5; i++) {
                  System.out.println("Thread is running: " + i);
                  Thread.yield(); // Suggest the thread scheduler to yield execution
              }
          });

          thread.start();

          try {
              thread.join(); // Wait for the thread to finish
          } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
          }

          System.out.println("Main thread resumes after thread completion.");
      }
  }

`;
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'gray',
      }}>
      <ScrollView
        horizontal={true}
        style={{
          minHeight: 10,
          width: '100%',
          backgroundColor: 'pink',
          padding: moderateScale(20),
          paddingHorizontal: moderateScale(20),
        }}>
        <Text
          style={{
            fontSize: moderateScale(15),
          }}>
          {code}
        </Text>
      </ScrollView>
      <View
        style={{
          height: 500,
        }}></View>
    </ScrollView>
  );
};

export default ForTesting;

const styles = StyleSheet.create({});
