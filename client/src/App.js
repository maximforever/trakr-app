import "./assets/stylesheets/App.scss";
import React, { Component } from "react";
import SignInPage from "./components/signInPage";
import ExpenseForm from "./components/expenseForm";
import FilteredExpenseList from "./components/filteredExpenseList";
import Dashboard from "./components/dashboard";
import Navigation from "./components/navigation";
import Settings from "./components/settings";
import Analytics from "./components/analytics";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "loading",
      user: null,
      expenses: {},
      expenseToUpdate: {},
      categories: [],
      defaultMonthlyBudget: 0,
      pastBudgets: {},
      greeting: "Hi",
      currentDate: {
        month: 1,
        year: 1990,
      },
      showExpenseForm: false,
      currentPage: "home",
      datepickerPages: ["home", "analytics"],
    };

    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.fetchUserSettings = this.fetchUserSettings.bind(this);
    this.submitNewExpense = this.submitNewExpense.bind(this);
    this.submitExpenseEdit = this.submitExpenseEdit.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.updateUserSettings = this.updateUserSettings.bind(this);
    this.toggleExpenseForm = this.toggleExpenseForm.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.setCurrentDate = this.setCurrentDate.bind(this);
    this.editExpense = this.editExpense.bind(this);
    this.clearExpenseToUpdate = this.clearExpenseToUpdate.bind(this);
  }

  componentDidMount() {
    this.setCurrentDate();
    this.fetchSession();
  }

  render() {
    return <div className="App">{this.renderContent()}</div>;
  }

  renderContent() {
    switch (this.state.status) {
      case "loggedIn":
        return this.renderLoggedInInterface();
      case "loggedOut":
        return <SignInPage />;
      default:
        return null;
    }
  }

  renderLoggedInInterface() {
    return (
      <div>
        {this.renderNavigation()}
        <div className="non-navigation-content">
          {this.renderLoggedInBodyContent()}
        </div>
      </div>
    );
  }

  renderLoggedInBodyContent() {
    if (this.state.currentPage === "home") {
      return this.renderHome();
    } else if (this.state.currentPage === "analytics") {
      return this.renderAnalytics();
    } else if (this.state.currentPage === "settings") {
      return this.renderSettings();
    }
  }

  renderHome() {
    return (
      <div className="home">
        {this.renderDashboard()}
        <ExpenseForm
          key={this.state.expenseToUpdate.updated_at || 0}
          submitNewExpense={this.submitNewExpense}
          submitExpenseEdit={this.submitExpenseEdit}
          toggleExpenseForm={this.toggleExpenseForm}
          categories={this.state.categories}
          expenseToUpdate={this.state.expenseToUpdate}
          clearExpenseToUpdate={this.clearExpenseToUpdate}
        />
        {this.renderExpenseList()}
      </div>
    );
  }

  renderNavigation() {
    if (this.state.showExpenseForm) {
      return null;
    }

    return (
      <Navigation
        navigateToPage={this.navigateToPage}
        renderDateSelector={this.pageShouldIncludeDatepicker()}
        date={this.state.currentDate}
        nextMonth={this.nextMonth}
        previousMonth={this.previousMonth}
        setCurrentDate={this.setCurrentDate}
        userImage={this.state.user.image}
      />
    );
  }

  renderDashboard() {
    if (this.state.showExpenseForm) {
      return null;
    }

    return (
      <Dashboard
        expenses={this.currentMonthExpenses()}
        monthlyBudget={this.getCurrentMonthlyBudget()}
        currentDate={this.state.currentDate}
      />
    );
  }

  renderExpenseList() {
    return (
      <FilteredExpenseList
        expenses={this.currentMonthExpenses()}
        deleteExpense={this.deleteExpense}
        editExpense={this.editExpense}
      />
    );
  }

  renderAnalytics() {
    return (
      <Analytics
        currentMonthExpenses={this.currentMonthExpenses()}
        currentYearExpenses={this.currentYearExpenses()}
        categories={this.state.categories}
        monthlyBudget={this.getCurrentMonthlyBudget()}
        daysThisMonth={this.daysThisMonth()}
        displayYear={this.state.currentDate.year}
      />
    );
  }

  renderSettings() {
    return (
      <Settings
        defaultMonthlyBudget={this.state.defaultMonthlyBudget}
        currentMonthlyBudget={this.getCurrentMonthlyBudget()}
        preferredFirstName={this.state.user.firstName}
        updateUserSettings={this.updateUserSettings}
        pastBudgets={this.state.pastBudgets}
        key={this.state.defaultMonthlyBudget + this.getCurrentMonthlyBudget()}
      />
    );
  }

  getCurrentMonthlyBudget() {
    if (this.state.pastBudgets === undefined) {
      return;
    }

    const formattedMonth = this.formattedMonth(this.state.currentDate.month);
    const formattedYear = this.formattedYear(this.state.currentDate.year);
    const formattedDate = `${formattedYear}-${formattedMonth}`;

    if (this.state.pastBudgets[formattedDate] === undefined) {
      return this.state.defaultMonthlyBudget;
    } else {
      return this.state.pastBudgets[formattedDate];
    }
  }

  submitNewExpense(expense, resetExpenseFormOnResponse) {
    fetch("/api/v1/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 200) {
          let updatedCategories = this.state.categories;
          let updatedExpenses = this.insertOneExpense(response.newExpense);

          if (!updatedCategories.includes(expense.category)) {
            updatedCategories = updatedCategories.concat(expense.category);
          }

          this.setState(
            {
              expenses: updatedExpenses,
              categories: updatedCategories,
            },
            () => {
              this.toggleExpenseForm();
              resetExpenseFormOnResponse(true);
            }
          );
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => {
        console.log("Error submitting expense", error);
      });
  }

  submitExpenseEdit(expense, resetExpenseFormOnResponse) {
    fetch("/api/v1/expenses", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 200) {
          let updatedCategories = this.state.categories;
          let updatedExpenses = this.updateOneExpense(response.updatedExpense);

          if (!updatedCategories.includes(expense.category)) {
            updatedCategories = updatedCategories.concat(expense.category);
          }

          this.setState(
            {
              expenses: updatedExpenses,
              categories: updatedCategories,
            },
            () => {
              this.toggleExpenseForm();
              resetExpenseFormOnResponse(true);
            }
          );
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => {
        console.log("Error updating expense", error);
      });
  }

  deleteExpense(e, id) {
    e.stopPropagation();
    fetch(`/api/v1/expenses/${id}${this.yearParams()}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          expenses: this.generateUpdatedExpenseList(response.expenses),
          categories: response.categories,
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }

  clearExpenseToUpdate() {
    this.setState({
      expenseToUpdate: {},
    });
  }

  editExpense(e, id) {
    e.stopPropagation();
    let expenseToUpdate = this.findExpenseById(id);

    this.setState({ expenseToUpdate, showExpenseForm: true });
  }

  findExpenseById(id) {
    let expenses = this.currentMonthExpenses();

    return expenses.filter((expense) => {
      return expense.id === id;
    })[0];
  }

  fetchSession() {
    // TODO: session should return expenses & user data if the user is logged in
    // this doesn't need to be a separate request

    fetch("/session", this.fetchOptions())
      .then((res) => res.json())
      .then((response) => {
        this.setState(
          {
            status: response.status,
            user: response.loggedInUser,
          },
          () => {
            if (this.state.status === "loggedIn") {
              this.fetchExpenses();
              this.fetchUserSettings();
            }
          }
        );
      })
      .catch((error) => {
        console.log("Error fetching session data", error);
      });
  }

  fetchExpenses() {
    fetch(`/api/v1/expenses/${this.yearParams()}`)
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          expenses: this.generateUpdatedExpenseList(response.expenses),
          categories: response.categories,
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }

  fetchUserSettings() {
    fetch("/api/v1/users/settings")
      .then((res) => res.json())
      .then((response) => {
        let user = { ...this.state.user };
        user.firstName = response.preferredFirstName;

        this.setState({
          defaultMonthlyBudget: response.defaultMonthlyBudget,
          pastBudgets: response.pastBudgets,
          user,
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }

  setCurrentDate() {
    const d = new Date();

    let currentDate = {
      month: d.getMonth() + 1,
      year: 1900 + d.getYear(),
    };

    this.setState({
      currentDate,
    });
  }

  updateUserSettings(newSettings) {
    fetch("/api/v1/users/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSettings),
    })
      .then((res) => res.json())
      .then((response) => {
        let user = { ...this.state.user };
        user.firstName = response.preferredFirstName;

        this.setState({
          defaultMonthlyBudget: response.defaultMonthlyBudget,
          pastBudgets: response.pastBudgets,
          currentPage: "home",
          user,
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }

  navigateToPage(page) {
    this.setState({
      currentPage: page,
    });
  }

  pageShouldIncludeDatepicker() {
    return this.state.datepickerPages.includes(this.state.currentPage);
  }

  fetchOptions() {
    //const token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    return {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": "someTestValue",
      },
    };
  }

  toggleExpenseForm() {
    this.setState((prevState) => {
      return {
        showExpenseForm: !prevState.showExpenseForm,
      };
    });
  }

  yearParams() {
    return `?year=${this.state.currentDate.year}`;
  }

  nextMonth() {
    // JS months run 0 to 11;
    let newMonth =
      this.state.currentDate.month < 12 ? this.state.currentDate.month + 1 : 1;
    let newYear =
      newMonth === 1
        ? this.state.currentDate.year + 1
        : this.state.currentDate.year;
    this.updateCurrentDate(newMonth, newYear);
  }

  previousMonth() {
    // JS months run 0 to 11
    let newMonth =
      this.state.currentDate.month > 1 ? this.state.currentDate.month - 1 : 12;
    let newYear =
      newMonth === 12
        ? this.state.currentDate.year - 1
        : this.state.currentDate.year;
    this.updateCurrentDate(newMonth, newYear);
  }

  updateCurrentDate(newMonth, newYear) {
    const currentDate = {
      month: newMonth,
      year: newYear,
    };

    this.setState({ currentDate }, () => {
      if (!this.thisYearsExpensesAreAvailable()) {
        this.fetchExpenses();
      }
    });
  }

  thisYearsExpensesAreAvailable() {
    const thisYear = this.state.currentDate.year;
    return typeof this.state.expenses[thisYear] !== "undefined";
  }

  generateUpdatedExpenseList(incomingExpenses) {
    const year = this.formattedYear(this.state.currentDate.year);
    let currentExpenses = { ...this.state.expenses };
    currentExpenses[year] = {};

    incomingExpenses.forEach((expense) => {
      const month = new Date(expense.timestamp).getMonth() + 1;
      // add trailing 0
      const formattedMonth = this.formattedMonth(month);

      if (typeof currentExpenses[year][formattedMonth] === "undefined") {
        currentExpenses[year][formattedMonth] = [expense];
      } else {
        currentExpenses[year][formattedMonth].push(expense);
      }
    });

    return currentExpenses;
  }

  insertOneExpense(expense) {
    let currentExpenses = { ...this.state.expenses };
    const month = this.formattedMonth(
      new Date(expense.timestamp).getMonth() + 1
    );
    const year = this.formattedYear(
      new Date(expense.timestamp).getYear() + 1900
    );

    if (currentExpenses[year][month] === undefined) {
      currentExpenses[year][month] = [];
    }

    currentExpenses[year][month].push({ ...expense, new: true });
    return currentExpenses;
  }

  updateOneExpense(updatedExpense) {
    let currentExpenses = { ...this.state.expenses };
    const month = this.formattedMonth(
      new Date(updatedExpense.timestamp).getMonth() + 1
    );
    const year = this.formattedYear(
      new Date(updatedExpense.timestamp).getYear() + 1900
    );

    currentExpenses[year][month] = currentExpenses[year][month].map(
      (expense) => {
        if (expense.id === updatedExpense.id) {
          return { ...updatedExpense, new: true };
        } else {
          return expense;
        }
      }
    );

    return currentExpenses;
  }

  currentMonthExpenses() {
    if (
      typeof this.state.expenses[
        this.formattedYear(this.state.currentDate.year)
      ] === "undefined"
    ) {
      return [];
    }

    const thisYearsExpenses =
      this.state.expenses[this.formattedYear(this.state.currentDate.year)];
    const thisMonthsExpenses =
      thisYearsExpenses[this.formattedMonth(this.state.currentDate.month)];

    return thisMonthsExpenses || [];
  }

  currentYearExpenses() {
    if (
      typeof this.state.expenses[
        this.formattedYear(this.state.currentDate.year)
      ] === "undefined"
    ) {
      return [];
    }

    return (
      this.state.expenses[this.formattedYear(this.state.currentDate.year)] || []
    );
  }

  formattedMonth(month) {
    return month.toString().length === 1 ? `0${month}` : month.toString();
  }

  formattedYear(year) {
    return year.toString();
  }

  daysThisMonth() {
    return new Date(
      this.state.currentDate.year,
      this.state.currentDate.month,
      0
    ).getDate();
  }
}
